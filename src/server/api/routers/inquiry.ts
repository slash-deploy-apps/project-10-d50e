import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { db } from '~/server/db';
import { quoteInquiries, quoteInquiryItems } from '~/server/db/schema';
import { products } from '~/server/db/schema';
import { desc, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { sendQuoteInquiryNotification } from '~/server/email';

const createInquirySchema = z.object({
  customerName: z.string().min(1),
  companyName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().default(1),
        note: z.string().optional(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export const inquiryRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return db.query.quoteInquiries.findMany({
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
      orderBy: [desc(quoteInquiries.createdAt)],
    });
  }),

  create: publicProcedure
    .input(createInquirySchema)
    .mutation(async ({ input }) => {
      const { items, ...inquiryData } = input;

      const [inquiry] = await db.insert(quoteInquiries).values(inquiryData).returning();

      if (!inquiry) {
        throw new Error('Failed to create inquiry');
      }

      const inquiryItems = items.map((item) => ({
        ...item,
        inquiryId: inquiry.id,
      }));

      await db.insert(quoteInquiryItems).values(inquiryItems);

      // Send email notification (non-blocking)
      const productIds = items.map((item) => item.productId);
      const productList = await db.select({
        id: products.id,
        modelName: products.modelName,
        inputVoltage: products.inputVoltage,
        outputVoltage: products.outputVoltage,
        outputCurrent: products.outputCurrent,
      }).from(products).where(inArray(products.id, productIds));

      const emailItems = items.map((item) => {
        const product = productList.find((p) => p.id === item.productId);
        return {
          modelName: product?.modelName ?? 'Unknown',
          quantity: item.quantity,
          inputVoltage: product?.inputVoltage,
          outputVoltage: product?.outputVoltage,
          outputCurrent: product?.outputCurrent,
        };
      });

      sendQuoteInquiryNotification({
        inquiryId: inquiry.id,
        customerName: input.customerName,
        companyName: input.companyName,
        email: input.email,
        phone: input.phone,
        message: input.message,
        items: emailItems,
      }).catch((err) => {
        console.error('[Inquiry] Email notification failed:', err);
      });

      return inquiry;
    }),
});
import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  resendInstance ??= new Resend(process.env.RESEND_API_KEY ?? '');
  return resendInstance;
}

interface QuoteInquiryEmailData {
  inquiryId: string;
  customerName: string;
  companyName?: string;
  email: string;
  phone?: string;
  message?: string;
  items: Array<{
    modelName: string;
    quantity: number;
    inputVoltage?: string | null;
    outputVoltage?: string | null;
    outputCurrent?: string | null;
  }>;
}

export async function sendQuoteInquiryNotification(data: QuoteInquiryEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@powerplaza.com';
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('[Email] RESEND_API_KEY not set, skipping email notification for inquiry:', data.inquiryId);
    return;
  }

  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border:1px solid #e2e8f0;font-family:monospace;">${item.modelName}</td>
          <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #e2e8f0;">${item.inputVoltage ?? '-'}</td>
          <td style="padding:8px;border:1px solid #e2e8f0;">${item.outputVoltage ?? '-'}</td>
          <td style="padding:8px;border:1px solid #e2e8f0;">${item.outputCurrent ?? '-'}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:sans-serif;">
      <h2 style="color:#0369A1;">새 견적 문의가 접수되었습니다</h2>
      <p style="color:#64748b;">New Quote Inquiry Received</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:4px 8px;color:#64748b;width:120px;">문의번호</td><td style="padding:4px 8px;font-family:monospace;font-weight:bold;">${data.inquiryId}</td></tr>
        <tr><td style="padding:4px 8px;color:#64748b;">고객명</td><td style="padding:4px 8px;">${data.customerName}</td></tr>
        ${data.companyName ? `<tr><td style="padding:4px 8px;color:#64748b;">회사명</td><td style="padding:4px 8px;">${data.companyName}</td></tr>` : ''}
        <tr><td style="padding:4px 8px;color:#64748b;">이메일</td><td style="padding:4px 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding:4px 8px;color:#64748b;">전화번호</td><td style="padding:4px 8px;">${data.phone}</td></tr>` : ''}
      </table>
      ${data.message ? `<p style="margin:16px 0;color:#64748b;">문의 내용: ${data.message}</p>` : ''}
      <h3 style="margin-top:24px;">요청 제품</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">모델명</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:center;">수량</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">입력전압</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">출력전압</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">출력전류</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
      <p style="color:#94a3b8;font-size:12px;">PowerPlaza 견적 문의 자동 알림</p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: 'PowerPlaza <noreply@powerplaza.com>',
      to: adminEmail,
      subject: `[PowerPlaza] 새 견적 문의 - ${data.inquiryId}`,
      html,
    });
    console.log('[Email] Notification sent for inquiry:', data.inquiryId, result.data?.id);
  } catch (error) {
    console.error('[Email] Failed to send notification for inquiry:', data.inquiryId, error);
  }
}
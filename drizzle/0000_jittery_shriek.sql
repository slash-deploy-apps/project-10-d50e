CREATE TABLE `account` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`accountId` text(255) NOT NULL,
	`providerId` text(255) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text(255),
	`idToken` text,
	`password` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE TABLE `admin_setting` (
	`key` text(255) PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`nameEn` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text,
	`descriptionEn` text,
	`imageUrl` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_slug_unique` ON `category` (`slug`);--> statement-breakpoint
CREATE TABLE `product_series` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`categoryId` text(255) NOT NULL,
	`name` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text,
	`descriptionEn` text,
	`features` text DEFAULT '[]',
	`featuresEn` text DEFAULT '[]',
	`imageUrl` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_series_slug_unique` ON `product_series` (`slug`);--> statement-breakpoint
CREATE TABLE `product` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`seriesId` text(255) NOT NULL,
	`modelName` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`imageUrl` text,
	`inputVoltage` text,
	`outputVoltage` text,
	`outputCurrent` text,
	`outputType` text,
	`price` integer,
	`priceNote` text,
	`datasheetUrl` text,
	`certifications` text DEFAULT '[]',
	`status` text(50) DEFAULT 'active' NOT NULL,
	`specs` text DEFAULT '{}',
	`specsEn` text DEFAULT '{}',
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`seriesId`) REFERENCES `product_series`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_slug_unique` ON `product` (`slug`);--> statement-breakpoint
CREATE TABLE `quote_inquiry` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`customerName` text(255) NOT NULL,
	`companyName` text(255),
	`email` text(255) NOT NULL,
	`phone` text(255),
	`message` text,
	`status` text(50) DEFAULT 'pending' NOT NULL,
	`adminNote` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `quote_inquiry_item` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`inquiryId` text(255) NOT NULL,
	`productId` text(255) NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`note` text,
	FOREIGN KEY (`inquiryId`) REFERENCES `quote_inquiry`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text(255),
	`userAgent` text(255),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`emailVerified` integer DEFAULT false,
	`image` text(255),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`identifier` text(255) NOT NULL,
	`value` text(255) NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);
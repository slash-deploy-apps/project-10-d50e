ALTER TABLE `session` ADD `impersonatedBy` text(255);--> statement-breakpoint
ALTER TABLE `user` ADD `banned` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `banReason` text;--> statement-breakpoint
ALTER TABLE `user` ADD `banExpires` integer;
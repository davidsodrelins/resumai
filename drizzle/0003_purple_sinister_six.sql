ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `loginMethod` varchar(64) DEFAULT 'email';--> statement-breakpoint
ALTER TABLE `users` ADD `password_hash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `is_donor` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `total_donated` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_donation_at` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_customer_id` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `resumes_this_month` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_reset_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);
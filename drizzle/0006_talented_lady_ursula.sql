ALTER TABLE `users` ADD `referral_level` enum('bronze','silver','gold','platinum') DEFAULT 'bronze' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `total_referrals` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `bonus_resumes` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `unlimited_until` timestamp;
DROP TABLE `activity_logs`;--> statement-breakpoint
DROP TABLE `blog_posts`;--> statement-breakpoint
DROP TABLE `password_reset_tokens`;--> statement-breakpoint
DROP TABLE `referrals`;--> statement-breakpoint
DROP TABLE `user_achievements`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `is_blocked`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `state`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `preferred_language`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `referral_level`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `total_referrals`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `bonus_resumes`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `unlimited_until`;
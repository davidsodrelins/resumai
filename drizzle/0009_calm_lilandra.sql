CREATE TABLE `activity_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`target_user_id` int,
	`action` varchar(100) NOT NULL,
	`details` text,
	`ip_address` varchar(45),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`author_id` int NOT NULL,
	`category` varchar(100),
	`tags` text,
	`meta_description` varchar(160),
	`featured_image` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`view_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`used` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_id` int NOT NULL,
	`referred_id` int,
	`referral_code` varchar(50) NOT NULL,
	`status` enum('pending','completed','rewarded') NOT NULL DEFAULT 'pending',
	`reward_credits` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`rewarded_at` timestamp,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referral_code_unique` UNIQUE(`referral_code`)
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`achievement_id` varchar(100) NOT NULL,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	`notified` int NOT NULL DEFAULT 0,
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `is_blocked` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `state` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `preferred_language` enum('pt','en','es') DEFAULT 'pt' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `referral_level` enum('bronze','silver','gold','platinum') DEFAULT 'bronze' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `total_referrals` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `bonus_resumes` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `unlimited_until` timestamp;
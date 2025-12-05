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

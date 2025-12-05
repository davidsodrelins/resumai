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
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`stripe_payment_intent_id` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'brl',
	`status` enum('pending','succeeded','failed','canceled') NOT NULL DEFAULT 'pending',
	`payment_method` varchar(50),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripe_payment_intent_id_unique` UNIQUE(`stripe_payment_intent_id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `is_blocked` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `state` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `preferred_language` enum('pt','en','es') DEFAULT 'pt' NOT NULL;
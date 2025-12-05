CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`achievement_id` varchar(100) NOT NULL,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	`notified` int NOT NULL DEFAULT 0,
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);

/*
** EPITECH PROJECT, 2024
** area
** File description:
** types
*/

export type UserAndServices = {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    description: string;
    services: string[];
    created_at: Date;
    updated_at: Date;
};

export type User = {
    id: number;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    is_active: boolean;
    token: string;
};

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type UserCardProps = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

export const UserCard: React.FC<UserCardProps> = ({
  name,
  email,
  avatarUrl,
}) => {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
      <Avatar className="w-10 h-10 flex items-center justify-center">
        <AvatarImage
          src={avatarUrl}
          alt="Laura"
          className="rounded-md object-cover"
        />
        <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {name}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {email}
        </span>
      </div>
    </div>
  );
};

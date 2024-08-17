import React from "react";

interface TweetProps {
  id: string;
  text: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

const Tweet: React.FC<TweetProps> = ({ text, user }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow flex space-x-3">
      <div className="flex-shrink-0">
        <img
          src={
            user?.avatar
              ? `REDACTEDapi/files/_pb_users_auth_/${user.id}/${user.avatar}`
              : `https://api.dicebear.com/9.x/big-smile/svg?seed=${user.username}`
          }
          alt={`${user.username}'s avatar`}
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-gray-900">
          <span className=" text-black/50">@</span>
          {user.username}
        </p>
        <p className="text-gray-700 mt-1">{text}</p>
      </div>
    </div>
  );
};

export default Tweet;

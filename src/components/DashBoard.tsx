// components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { usePocketBase } from "../hooks/usePocketBase";
import Tweet from "./Tweet";

interface TweetData {
  id: string;
  text: string;
  user: string;
  expand?: {
    user?: {
      id: string;
      username: string;
      avatar?: string;
    };
  };
}

const Dashboard: React.FC = () => {
  const { pb, currentUser } = usePocketBase();
  const [tweetText, setTweetText] = useState("");
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const resultList = await pb.collection("tweets").getList(1, 50, {
        sort: "-created",
        expand: "user",
      });

      const formattedTweets: TweetData[] = resultList.items.map(
        (item: any) => ({
          id: item.id,
          text: item.text,
          user: item.user,
          expand: {
            user: item.expand?.user
              ? {
                  id: item.expand.user.id,
                  username: item.expand.user.username,
                  avatar: item.expand.user.avatar,
                }
              : undefined,
          },
        })
      );

      setTweets(formattedTweets);
      setError(null);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError("Failed to fetch tweets. Please try again later.");
    }
  };

  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    try {
      await pb.collection("tweets").create({
        text: tweetText,
        user: currentUser?.id,
      });
      setTweetText("");
      fetchTweets();
      setError(null);
    } catch (error) {
      console.error("Error posting tweet:", error);
      setError("Failed to post tweet. Please try again.");
    }
  };

  if (!currentUser) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Post a Tweet</h2>
        <form onSubmit={handleTweetSubmit} className="space-y-4">
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="What's happening?"
            maxLength={280}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Tweet
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Tweets</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {tweets.length === 0 && !error && (
          <p className="text-gray-500">No tweets yet. Be the first to tweet!</p>
        )}
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              text={tweet.text}
              user={tweet.expand?.user!}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

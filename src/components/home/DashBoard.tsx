import React, { useState, useEffect, useRef } from "react";
import Tweet from "./Tweet";
import { usePocketBase } from "../../hooks/usePocketBase";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface TweetData {
  id: string;
  text: string;
  user: string;
  created: Date;
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
  const [isLoading, setIsLoading] = useState(true);
  const fetchTweetsRef = useRef<() => void>(() => {});

  // Setup skeleton
  const TweetSkeleton = () => (
    <div className="bg-white p-4 rounded-md shadow flex space-x-3">
      <div className="flex-shrink-0">
        <Skeleton circle width={40} height={40} />
      </div>
      <div className="flex-grow">
        <Skeleton width={100} />
        <Skeleton count={2} />
      </div>
    </div>
  );

  useEffect(() => {
    let isMounted = true;

    const fetchTweets = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const resultList = await pb.collection("tweets").getList(1, 50, {
          sort: "-created",
          expand: "user",
        });

        if (isMounted) {
          const formattedTweets: TweetData[] = resultList.items.map(
            (item: any) => ({
              id: item.id,
              text: item.text,
              user: item.user,
              created: new Date(item.created),
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
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching tweets:", error);
          setError("Failed to fetch tweets. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTweetsRef.current = fetchTweets;
    fetchTweets();

    return () => {
      isMounted = false;
    };
  }, [currentUser, pb]);

  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    try {
      await pb.collection("tweets").create({
        text: tweetText,
        user: currentUser?.id,
      });
      setTweetText("");
      // Refresh tweets after posting
      const resultList = await pb.collection("tweets").getList(1, 50, {
        sort: "-created",
        expand: "user",
      });
      const formattedTweets: TweetData[] = resultList.items.map(
        (item: any) => ({
          id: item.id,
          text: item.text,
          user: item.user,
          created: new Date(item.created),
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
    } catch (error) {
      console.error("Error posting tweet:", error);
      setError("Failed to post tweet. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 p-4 max-w-2xl">
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <Skeleton width={200} height={24} className="mb-4 rounded" />
          <Skeleton height={100} className="mb-6 rounded-lg" />
          <Skeleton width={100} height={40} className="rounded-full" />
        </div>
        <div>
          <Skeleton width={200} height={24} className="mb-4 rounded" />
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <TweetSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <div>Please log in to view the dashboard.</div>;
  }

  console.log(tweets);
  return (
    <div className="container mx-auto mt-8 p-4 max-w-2xl">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Post a Tweet</h2>
        <form onSubmit={handleTweetSubmit} className="space-y-4">
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-500"
            rows={3}
            placeholder="What's happening?"
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            {/* Character Counter Spinner */}
            <div className="relative">
              <svg
                className="w-8 h-8 text-blue-500"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-gray-300"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="97.39"
                  strokeDashoffset={97.39 * (1 - tweetText.length / 280)}
                  className="text-blue-500 transition-all duration-300 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">
                {280 - tweetText.length}
              </span>
            </div>
            {/* Tweet Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
              disabled={tweetText.length > 280}
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
      <button
        onClick={() => fetchTweetsRef.current()}
        className="mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
      >
        Refresh Tweets
      </button>
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Tweets</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!isLoading && tweets.length === 0 && !error && (
          <p className="text-gray-500 text-center">
            No tweets yet. Be the first to tweet!
          </p>
        )}
        <div className="space-y-6">
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              text={tweet.text}
              created={tweet.created}
              user={tweet.expand?.user!}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

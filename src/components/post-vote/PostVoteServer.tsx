// -> Beyond codebase
import { Post, Vote, VoteType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";
// -> Within codebase


type PostVoteServerProps = {
  postId: string;
  initialVotesAmt?: number;
  initialVoteType: VoteType;
  getData?: () => Promise<(Post & { votes: Vote[]}) | null>
}

const PostVoteServer = async (props: PostVoteServerProps) => {
  const { postId, initialVotesAmt, initialVoteType, getData } = props;

  const session = await getServerSession();

  let _votesAmt: number = 0;
  let _currentVoteType: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    if (post.votes) {
      _votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc + -1;
        return acc;
      }, 0);
      
      _currentVoteType = post.votes.find((vote => vote.userId === session?.user.id))?.type;
    }
  } else {
    _votesAmt = initialVotesAmt!;
    _currentVoteType = initialVoteType;
  }
  return <PostVoteClient postId={postId} initialVotesAmt={_votesAmt} initialVote={_currentVoteType} />
}

export default PostVoteServer;

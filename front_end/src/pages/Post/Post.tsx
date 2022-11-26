import { useEffect } from "react";

const Post: React.FC<{ post: object | null }> = (props: {
  post: object | null;
}) => {
  useEffect(() => {
    console.log(props.post);
  });
  return <></>;
};

export default Post;

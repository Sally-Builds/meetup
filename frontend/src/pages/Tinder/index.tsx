import React, { useState, useMemo, useRef, RefObject, useEffect } from "react";
import TinderCard from "react-tinder-card";
import styles from "./index.module.css";
import { Badge, useToast, Stack } from "@chakra-ui/react";
import { IUser, getAllUsers } from "../../api/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendRequest } from "../../api/request";
import { useUserStore } from "../../store/userStore";

interface Character {
  name: string;
  url: string;
}

interface TinderCardRef {
  swipe: (dir: string) => Promise<void>;
  restoreCard: () => Promise<void>;
}

const Tinder: React.FC = () => {
  const [lastDirection, setLastDirection] = useState<string>("");
  const [db, setDb] = useState<IUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Initialize to 0 instead of db.length - 1
  const currentIndexRef = useRef(currentIndex);
  const toast = useToast();

  const { loggedInUser } = useUserStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const { mutateAsync: sendRequestMutation } = useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      console.log("success");
      toast({
        description: "Request Sent",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      console.log(error, "from use Mutation error");
      if (error.response && error.response.data) {
        toast({
          description: error.response.data.msg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          description: "error login in",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSettled: (_) => {
      // setIsLoading(false);
    },
  });

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef()),
    [db.length] // Update refs when db length changes
  );

  useEffect(() => {
    if (data) {
      setDb(data);
      setCurrentIndex(data.length - 1);
    }
  }, [data]);

  if (isLoading) return <>loading...</>;

  if (error) return <>An Error occurred Fetching users</>;

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, nameToDelete: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    if (currentIndexRef.current >= idx) {
      // Handle the case where the card is restored
      if (childRefs[idx].current) {
        childRefs[idx].current.restoreCard();
      }
    }
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex >= 0) {
      const ref = childRefs[currentIndex].current;
      if (ref) {
        await ref.swipe(dir);
        console.log(dir);
        if (dir == "right" && data) {
          await sendRequestMutation(data[currentIndex]._id);
        }
      }
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    const ref = childRefs[newIndex].current;
    if (ref) {
      await ref.restoreCard();
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["cardContainer"]}>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className={styles["swipe"]}
            key={character.full_name}
            onSwipe={(dir: string) => swiped(dir, character.full_name, index)}
            onCardLeftScreen={() => outOfFrame(character.full_name, index)}
          >
            <div
              style={{ backgroundImage: `url(${character.profile_image.url})` }}
              className={styles["card"]}
            >
              <h3>{character.full_name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <Stack direction="row">
        {data && data.length > 0 && canSwipe > 0 && (
          <>
            {data[currentIndex].interests.map((interest) => (
              <>
                {loggedInUser && loggedInUser.interests.length > 0 && (
                  <>
                    {loggedInUser.interests.includes(interest) ? (
                      <Badge key={interest} color={"green"}>
                        {" "}
                        {interest}{" "}
                      </Badge>
                    ) : (
                      <>
                        <Badge key={interest}> {interest} </Badge>
                      </>
                    )}
                  </>
                )}
              </>
            ))}
          </>
        )}
      </Stack>
      <Stack>
        {data && data.length > 0 && canSwipe > 0 && (
          <div>
            <Badge>
              Similarity Score: {data[currentIndex].similarityScore}
            </Badge>
          </div>
        )}
      </Stack>
      <div className={styles["buttons"]}>
        <button
          style={{ backgroundColor: !canSwipe ? "#c3c4d3" : undefined }}
          disabled={!canSwipe && isLoading}
          onClick={() => swipe("left")}
        >
          Decline
        </button>
        <button
          style={{ backgroundColor: !canGoBack ? "#c3c4d3" : undefined }}
          onClick={() => goBack()}
        >
          Undo
        </button>
        <button
          style={{ backgroundColor: !canSwipe ? "#c3c4d3" : undefined }}
          disabled={!canSwipe && isLoading}
          onClick={() => swipe("right")}
        >
          Connect
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection}>
          {lastDirection == "right" ? "Request Sent" : "Not Interested"}
        </h2>
      ) : (
        <h2>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
};

export default Tinder;
function toast(arg0: {
  description: any;
  status: string;
  duration: number;
  isClosable: boolean;
}) {
  throw new Error("Function not implemented.");
}

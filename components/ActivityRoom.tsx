import { GETSTREAM_API_KEY, GETSTREAM_APP_ID } from "@/libs/constants";
import React from "react";
import {
  StreamApp,
  NotificationDropdown,
  FlatFeed,
  LikeButton,
  Activity,
  CommentList,
  CommentField,
  StatusUpdateForm,
} from "react-activity-feed";
import "react-activity-feed/dist/index.css";

type ActivityRoomProps = {
  userToken: string;
  userId: string;
  userName: string;
  avatar: string;
};

const ActivityRoom = ({
  userToken,
  userId,
  userName,
  avatar,
}: ActivityRoomProps) => {
  return (
    <StreamApp
      apiKey={GETSTREAM_API_KEY}
      appId={GETSTREAM_APP_ID}
      token={userToken}
    >
      <NotificationDropdown notify />
      <StatusUpdateForm />
      <FlatFeed
        // @ts-ignore
        options={{ reactions: { recent: true } }}
        notify
        Activity={(props) => (
          <Activity
            {...props}
            Footer={() => (
              <div style={{ padding: "8px 16px" }}>
                <LikeButton {...props} />
                <CommentField
                  activity={props.activity}
                  // @ts-ignore
                  onAddReaction={props.onAddReaction}
                />
                <CommentList activityId={props.activity.id} />
              </div>
            )}
          />
        )}
      />
    </StreamApp>
    // <StreamApp
    //   apiKey="dz5f4d5kzrue"
    //   appId="102254"
    //   token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoieWVsbG93LWJvbnVzLTUiLCJleHAiOjE2NTYyOTI5MzF9.JOxhm9C1-_MeW6qQf5hEuky7StuPOB1yNVCdydTC01o"
    // >
    //   <NotificationDropdown notify />
    //   <StatusUpdateForm />
    //   <FlatFeed
    //     options={{ reactions: { recent: true } }}
    //     notify
    //     Activity={(props) => (
    //       <Activity
    //         {...props}
    //         Footer={() => (
    //           <div style={{ padding: "8px 16px" }}>
    //             <LikeButton {...props} />
    //             <CommentField
    //               activity={props.activity}
    //               onAddReaction={props.onAddReaction}
    //             />
    //             <CommentList activityId={props.activity.id} />
    //           </div>
    //         )}
    //       />
    //     )}
    //   />
    // </StreamApp>
  );
};

export default ActivityRoom;

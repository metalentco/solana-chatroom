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
  CommentItem,
} from "react-activity-feed";
import "react-activity-feed/dist/index.css";

type ActivityRoomProps = {
  userToken: string;
  userId: string;
};

const ActivityRoom = ({ userToken, userId }: ActivityRoomProps) => {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <StreamApp
        apiKey={GETSTREAM_API_KEY}
        appId={GETSTREAM_APP_ID}
        token={userToken}
        // @ts-ignore
        userId={userId}
      >
        <div
          style={{
            background: "#fff",
            height: 60,
            borderRadius: 4,
            margin: "10px 0",
            padding: "0 20px",
            boxShadow: "0px 0px 4px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <h3>Next Chat</h3>
          <NotificationDropdown
            // @ts-ignore
            arrow
            right
          />
        </div>
        {/* <StatusUpdateForm feedGroup="timeline" /> */}
        <FlatFeed
          notify
          feedGroup="timeline"
          Activity={(activityProps) => (
            <Activity
              {...activityProps}
              Footer={() => (
                <React.Fragment>
                  <CommentField
                    activity={activityProps.activity}
                    // @ts-ignore
                    onAddReaction={activityProps.onAddReaction}
                  />
                  <CommentList
                    activityId={activityProps.activity.id}
                    CommentItem={(props) => (
                      <React.Fragment>
                        <CommentItem {...props} style={{marginLeft: 10, marginRight: 10}} />
                        <LikeButton
                          style={{padding: "0 10px 10px 10px", marginLeft: 10, marginRight: 10}}
                          reaction={props.comment}
                          {...activityProps}
                        />
                      </React.Fragment>
                    )}
                  />
                </React.Fragment>
              )}
            />
          )}
        />
      </StreamApp>
    </div>
  );
};

export default ActivityRoom;

## Database Schema for Two Plus 
### Baby's First No-SQL Schema
```jsx
const DB = {
  users: [
    userId: {
      firstName: String,
      lastName: String,
      email: String
      posts: [String, String, String],
      isAdmin: Bool
    },
  ],
  posts:[
    postId: {
      userRef: String (userId),
      title: String,
      description: String,
      docChanges:[{
        changeID: String
      }],
      editorData: String,
      messages:[{
        userRef: String,
        content: String,
        timestamp: String
      }],
      //Stretch Goals - R/W limits 
      // changes: [{
      //   userRef: String
      //   content: String,
      //   timestamp: String
      // },{
      //   userRef: String
      //   content: String,
      //   timestamp: String
      // }],
    },
  ]
}```



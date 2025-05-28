- Authentication APIs (authRouter)
- Endpoints to manage user authentication.

Method	        Endpoint	            Description
POST	        /signup	                Register a new user.
POST	        /login	                Authenticate and log in a user.
POST	        /logout	                Log out a user securely.
PATCH	        /forgetPassword	        Change user password when user is not login.




- Profile Management APIs (profileRouter)
- Endpoints to manage user profiles.

Method	        Endpoint	                    Description
GET	            /profile/view	                View the logged-in user's profile.
PATCH	        /profile/edit	                Edit the logged-in user's profile.
PATCH	        /profile/changePassword	        Change user password when user is login.
DELETE	        /profile/delete	                Delete the user's account.
PATCH	        /profile/changeStatus	        Temporarily deactivate or reactivate user's account.
GET	            /profile/:userId	            View another user's public profile.




* Connection APIs (connectionRequestRouter & userConnections)
- Connection Request APIs (connectionRequestRouter)
- Manage connection requests between users.

Method	        Endpoint	                            Description
POST	        /request/send/interested/:toUserId	    Send a connection request.
POST	        /request/send/ignored/:toUserId	        Ignore a user.

NOTE: you can merge these two APIs by making the status{interested, ignored} dynamic.
POST            /request/send/:status/:toUserId

GET	            /requests/send	                        View all sent connection requests.
GET	            /requests/received	                    View all received connection requests.

POST	        /request/review/accepted/:requestId	    Accept a connection request.
POST	        /request/review/rejected/:requestId	    Reject a connection request.
POST	        /request/review/retrieve/:requestId	    Retrieve a sent connection request.

NOTE: you can merge these three APIs by making the status{accepted, rejected, retrieve} dynamic.
POST            /request/review/:status/:requestId

- User Connections APIs (userConnections)
- Manage user connections and view suggestions.

Method	        Endpoint	                                Description
GET	            /user/feed	                                View profiles of suggested users.
POST	        /user/connections	                        View all connections.
DELETE	        /user/connections/:connectionId	            Remove a connection.




- Search APIs (searchRouter)
- Endpoints to search for users, skills, or topics.

Method	        Endpoint	                    Description
GET             /search	                        Search using query parameters like name, skill, etc.




* Future Scope
- Post Management APIs
- Endpoints for managing user-generated posts in a feed.

Method	        Endpoint	                        Description
GET	            /feed/posts	                        View posts shared by connections.
POST	        /feed/post	                        Create a new post in the feed.
DELETE	        /feed/post/:postId	                Delete a post from the feed.
POST	        /feed/post/:postId/like	            Like a post.
POST	        /feed/post/:postId/comment	        Add a comment to a post.



- Messaging APIs
- Endpoints for user-to-user messaging.

Method	        Endpoint	                        Description
POST	        /message/send/:userId	            Send a direct message to a user.
GET	            /message/conversation/:userId	    View conversation with a user.




- Project Management APIs
- Endpoints for adding and managing user projects.

Method	        Endpoint	                        Description
POST	        /projects/add	                    Add a project to a profile.
PATCH	        /projects/edit/:projectId	        Edit an existing project.
DELETE	        /projects/remove/:projectId	        Remove a project from a profile.
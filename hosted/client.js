/* If you haven't, take a look at the basic-socket-io-done
   demo on GitHub before reading this one. This demo assumes
   you know basic socket.io concepts.

   https://github.com/IGM-RichMedia-at-RIT/basic-socket-io-done

   In that basic demo, we handled swapping channels by
   treating each channel name as an event name. When we
   sent chat messages to the server we also included our
   current channel name and the server broadcasted that message
   out to everyone. Those listening to the channel could use
   that data.
   
   That style of implementation is solid, but has some issues.
   The first issue is that our client is free to join any channel
   without validation. The second issue is that the server sends 
   *all* messages to *everyone*. Not everyone will see them, since
   it depends on what events the client is subscribed to, but socket
   will send all the messages to everyone.

   In this demo, we try to alleviate those issues by moving all
   channel logic server-side using the rooms functionality in
   the socket.io library.
*/

const socket = io();

const handleEditBox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editBox');
    const channelSelect = document.getElementById('channelSelect');

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if(editBox.value){
            /* Unlike in the basic demo, we are reverting to only
               sending simple text messages to the 'chat message'
               event channel, since the server will handle the
               messaging channel for us.
            */
            socket.emit('chat message', editBox.value);
            editBox.value = '';
        }

        return false;
    });
};

const displayMessage = (msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    document.getElementById('messages').appendChild(messageDiv);
}

const handleChannelSelect = () => {
    const channelSelect = document.getElementById('channelSelect');
    const messages = document.getElementById('messages');

    /* In the basic demo, we used this change event listener to
       selectively listen to specific channels and not listen to
       others. Instead, we will just tell our socket server that
       we want to change channels. We will do this by emitting the
       name of the channel we want to join to the 'room change'
       event channel. Server-side, we will handle that event by
       putting this user in the correct room. As a result, we can 
       just listen to the 'chat message' event channel because we 
       will only recieve updates for the rooms that we are in.
    */
    channelSelect.addEventListener('change', () => {
        messages.innerHTML = '';
        socket.emit('room change', channelSelect.value);
    });
}

const init = () => {
    handleEditBox();

    /* Rather than listen to general or memes like we did in
       the basic demo, we can always listen to 'chat message'.
       The server will only send us messages that are sent to
       the channel we are in, so we will only recieve messages
       we care about.
    */
    socket.on('chat message', displayMessage);
    handleChannelSelect();

    /* When we start up our client, we may want to request to
       join a specific channel from the server. In this demo,
       our server will automatically put new clients in the
       'general' channel so we do not need the following emit.

       However, some projects and applications may prefer that
       the client select it's default room. This is especially
       true if you have multiple different applications using
       the same socket server.
    */

    //socket.emit('room change', 'general');
};

window.onload = init;
export default {
    name: 'TheChatMessageComponents',
    props: ['message'],

    template:
    `
    <article :class="{ 'other-messages' : matchedID }">
        <p>{{ message.name }} <span>{{ message.time }}</span></p>
        <p>{{ message.text }}</p>
        <p>{{ message.content }}</p>
    </article>
    `,

    data() {
        return {
            message: 'Hello from the template.',
            // Every time an incoming message arrives, check against the user ID to see if this is ours.
            // If it IS, apply a CSS class to indicate that it's ours.
            // If it ISN'T, apply a different CSS class to make that obvious.
            matchedID: this.$parent.socketID == this.message.id
        }
    }
}
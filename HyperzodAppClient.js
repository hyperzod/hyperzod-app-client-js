export class HyperzodAppClient {
    constructor() {
        this.channel = 'hyperzod_apps'; // Default channel for communication
    }

    /**
     * Listens for a specific message type from the parent window.
     * @param {string} eventType - The type of event to listen for.
     * @returns {Promise} - Resolves with the event data when the message is received.
     */
    listenForMessageFromHyperzod(eventType) {
        return new Promise((resolve, reject) => {
            const messageHandler = (event) => {
                if (
                    event.data &&
                    event.data.channel === this.channel &&
                    event.data.type === eventType
                ) {
                    console.log('Received message from Parent Frame:', event.data);
                    window.removeEventListener('message', messageHandler); // Clean up the listener
                    resolve(event.data); // Resolve with the received data
                }
            };

            // Add the event listener
            window.addEventListener('message', messageHandler);

            // Set a timeout to reject the Promise if no message is received
            setTimeout(() => {
                window.removeEventListener('message', messageHandler); // Clean up the listener
                reject(new Error(`Timeout: No response for event type "${eventType}"`));
            }, 2000); // 2-second timeout
        });
    }

    /**
     * Sends a message to the parent window.
     * @param {string} type - The type of message to send.
     * @param {any} data - The data to send.
     */
    sendMessageToParent(type, data) {
        window.parent.postMessage({ channel: this.channel, type, data }, '*');
    }

    /**
     * Requests user data from the parent window.
     * @returns {Promise} - Resolves with the user data.
     */
    async getUserData() {
        // Send a message to the parent window requesting user data
        this.sendMessageToParent('user_data', null);

        // Wait for the response
        return await this.listenForMessageFromHyperzod('user_data');
    }

    /**
     * Requests user authentication token from the parent window.
     * @returns {Promise} - Resolves with the auth token data.
     */
    async getAuthToken() {
        // Send a message to the parent window requesting auth token
        this.sendMessageToParent('auth_token', null);

        // Wait for the response
        return await this.listenForMessageFromHyperzod('auth_token');
    }
}
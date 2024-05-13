const subscriptions = {
    data: [],
    listeners: [],

    add(item) {
        this.data.push(item);
        this.listeners.forEach(handler => handler(item));
    },

    check(item) {
        return this.data.some(user => user.name === item.name)
    },

    listen(handler) {
        this.listeners.push(handler);
    },
};

module.exports = subscriptions;
const groupBy = (items, prop) => {
    return items.reduce((out, item) => {
        const value = item[prop];
        out[value] = out[value] || [];
        out[value].push(item);
        return out;
    }, {});
};

module.exports = {
    groupBy,
};

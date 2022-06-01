const formatLngLat = (query, decimals, offset, plus) => {
    if (!plus) {
        return (parseFloat(query) - offset).toFixed(decimals);
    } else {
        return (parseFloat(query) + offset).toFixed(decimals);
    }
};

module.exports = { formatLngLat };

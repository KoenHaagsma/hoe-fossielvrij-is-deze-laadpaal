const poleScore = (poleScore, maxEmission) => {
    if (poleScore === undefined) return 'ffffff';
    // const baseValue = 80;
    const baseValue = maxEmission / 10;
    if (poleScore <= baseValue) {
        return '46BD54';
    } else if (poleScore > baseValue && poleScore <= baseValue * 2) {
        return 'C7D751';
    } else if (poleScore > baseValue * 2 && poleScore <= baseValue * 3) {
        return 'EAD649';
    } else if (poleScore > baseValue * 3 && poleScore <= baseValue * 4) {
        return 'D3A940';
    } else if (poleScore > baseValue * 4 && poleScore <= baseValue * 5) {
        return 'C08337';
    } else if (poleScore > baseValue * 5 && poleScore <= baseValue * 6) {
        return '9F522A';
    } else if (poleScore > baseValue * 6 && poleScore <= baseValue * 7) {
        return '733519';
    } else if (poleScore > baseValue * 7 && poleScore <= baseValue * 8) {
        return '422207';
    } else if (poleScore > baseValue * 8 && poleScore <= baseValue * 9) {
        return '251304';
    } else if (poleScore > baseValue * 9) {
        return '000000';
    } else {
        return 'ffffff';
    }
};

module.exports = { poleScore };

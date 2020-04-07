const getData = async () => {
    const covid = [
        {
            county: 'Washoe',
            cases: 10,
        },
        {
            county: 'Nye',
            cases: 12,
        },
    ];

    return covid;
};

module.exports = getData;

module.exports = {
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'MAV3Ndev',
                    name: 'CorrectionHelper'
                },
                prerelease: false,
                draft: true
            }
        }
    ]
}

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'subject-case': [
            2,
            'always',
            [
                'sentence-case',
                'start-case',
                'pascal-case',
                'upper-case',
                'lower-case',
            ],
        ],
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
                'content',
                'docs',
                'feat',
                'fix',
                'refactor',
                'style',
                'test',
                'deploy',
            ],
        ],
        'type-case': [2, 'always', 'lower-case'],
        'subject-full-stop': [2, 'never', '.'],
        'subject-min-length': [2, 'always', 5],
        'header-max-length': [2, 'always', 72],
        'body-max-line-length': [0, 'never'] // 1차 릴리즈를 위해 임시로 비활성화
    },
};

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    dir: './',
})

/** @type {import('jest').Config} */
const config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    preset: 'ts-jest',
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

        '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

        '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,

        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(ts|tsx)?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
    },
}

export default createJestConfig(config)


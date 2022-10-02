// setup file
const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
require('jest-enzyme')

enzyme.configure({ adapter: new Adapter() })

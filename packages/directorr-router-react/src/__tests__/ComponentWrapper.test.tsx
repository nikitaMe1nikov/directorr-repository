import { shallow } from 'enzyme'
import ComponentWrapper from '../ComponentWrapper'

describe('ComponentWrapper', () => {
  it('render', () => {
    const SomeComponent = () => null

    const nodes = shallow(<ComponentWrapper component={SomeComponent} />)

    expect(nodes.find(SomeComponent)).toHaveLength(1)
  })
})

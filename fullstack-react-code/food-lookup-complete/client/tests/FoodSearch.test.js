// We populate this file in the chapter "Unit Testing"
/* eslint-disable no-unused-vars */
import { shallow } from 'enzyme'
import React from 'react'
import FoodSearch from '../src/FoodSearch'
import Client from '../src/Client'

jest.mock('../src/Client')

describe('FoodSearch', () => {
  let wrapper
  const onFoodClick = jest.fn()

  beforeEach(() => {
    wrapper = shallow(
      <FoodSearch
        onFoodClick={onFoodClick} />
    )
  })

  afterEach(() => {
    Client.search.mockClear()
    onFoodClick.mockClear()
  })

  it('should not display the remove icon', () => {
    expect(
      wrapper.find('.remove.icon').length
    ).toBe(0)
  })

  it('should display zero rows', () => {
    expect(
      wrapper.find('tbody tr').length
    ).toBe(0)
  })

  describe('user populates search field', () => {
    const value = 'brocc'

    beforeEach(() => {
      const input = wrapper.find(`input`).first()
      input.simulate('change', {
        target: {
          value
        }
      })
    })

    it('should update the state property `searchValue`', () => {
      expect(
        wrapper.state().searchValue
      ).toEqual(value)
    })

    it('should display the remove icon', () => {
      expect(
        wrapper.find('.remove.icon').length
      ).toBe(1)
    })

    it('should call `Client.search()` with `value`', () => {
      const invocationArgs = Client.search.mock.calls[0]
      expect(
        invocationArgs[0]
      ).toEqual(value)
    })

    describe('and API returns results', () => {
      const foods = [
        {
          description: 'Broccolini',
          kcal: '100',
          protein_g: '11',
          fat_g: '21',
          carbohydrate_g: '31'
        },
        {
          description: 'Broccoli rabe',
          kcal: '200',
          protein_g: '12',
          fat_g: '22',
          carbohydrate_g: '32'
        }
      ]
      beforeEach(() => {
        const invocationArgs = Client.search.mock.calls[0]
        const cb = invocationArgs[1]
        cb(foods)
        wrapper.update()
      })

      it('should set the state property `foods`', () => {
        expect(
          wrapper.state().foods
        ).toEqual(foods)
      })

      it('should display two rows', () => {
        expect(
          wrapper.find('tbody tr').length
        ).toEqual(2)
      })

      it('should render the description of first food', () => {
        expect(
          wrapper.html()
        ).toContain(foods[0].description)
      })

      it('should render the description of second food', () => {
        expect(
          wrapper.html()
        ).toContain(foods[1].description)
      })

      describe('then user clicks food item', () => {
        beforeEach(() => {
          const foodRow = wrapper.find('tbody tr').first()
          foodRow.simulate('click')
        })

        it('should call `onFoodClick` with `food`', () => {
          const food = foods[0]
          expect(
            onFoodClick.mock.calls[0]
          ).toEqual([food])
        })
      })

      describe('then user types more', () => {
        const newVal = 'broccx'
        beforeEach(() => {
          const input = wrapper.find('input').first()
          input.simulate('change', {
            target: {
              value: newVal
            }
          })
        })

        it('should update the search to `broccx`', () => {
          expect(
            wrapper.state().searchValue
          ).toEqual('broccx')
        })
        it('should call `Client.search()` with `newVal`', () => {
          const secondInvocationArgs = Client.search.mock.calls[1]
          expect(
            secondInvocationArgs[0]
          ).toEqual(newVal)
        })

        describe('and API returns no results', () => {
          beforeEach(() => {
            const secondInvocationArgs = Client.search.mock.calls[1]
            const cb = secondInvocationArgs[1]
            cb([])
            wrapper.update()
          })

          it('should set the state property `foods`', () => {
            expect(
              wrapper.state().foods
            ).toEqual([])
          })
        })

        describe('the the user clears with backspace', () => {
          beforeEach(() => {
            const input = wrapper.find('input').first()
            input.simulate('change', {
              target: { value: '' }
            })
          })
          it('should set the state property `foods`', () => {
            expect(
              wrapper.state().foods
            ).toEqual([])
          })
          it('should set the state property `showRemoveIcon`', () => {
            expect(
              wrapper.state().showRemoveIcon
            ).toBe(false)
          })
        })

        describe('the user clicks the remove icon', () => {
          beforeEach(() => {
            const icon = wrapper.find('.remove.icon').first();
            icon.simulate('click');
          });

          it('should set the state property `foods`', () => {
            expect(
              wrapper.state().foods
            ).toEqual([]);
          });

          it('should set the state property `showRemoveIcon`', () => {
            expect(
              wrapper.state().showRemoveIcon
            ).toBe(false);
          });
        });
      })
    })
  })
})

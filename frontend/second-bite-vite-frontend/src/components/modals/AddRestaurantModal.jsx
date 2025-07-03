import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

import Select from 'react-select';
import { cuisine_filters_react_select } from '../misc/FilterTypes'
import states from '../misc/States'

const AddRestaurantModal = () => {
  const form_ref = useRef();
  const { is_add_restaurant_modal, setIsAddRestaurantModal } = useContext(AppContext)

  const [name_msg, setNameMsg] = useState('')
  const [cost_msg, setCostMsg] = useState('')
  const [about_msg, setAboutMsg] = useState('')
  const [mon_msg, setMonMsg] = useState('')
  const [tue_msg, setTueMsg] = useState('')
  const [wed_msg, setWedMsg] = useState('')
  const [thu_msg, setThuMsg] = useState('')
  const [fri_msg, setFriMsg] = useState('')
  const [sat_msg, setSatMsg] = useState('')
  const [sun_msg, setSunMsg] = useState('')
  const [street_msg, setStreetMsg] = useState('')
  const [city_msg, setCityMsg] = useState('')
  const [state_msg, setStateMsg] = useState('')
  const [postal_msg, setPostalMsg] = useState('')
  const [country_msg, setCountryMsg] = useState('')
    
  const weekdays = ["mon","tue","wed","thu","fri","sat","sun"]
  const weekday_labels = {
    mon: "Mon.",
    tue: "Tues.",
    wed: "Wed.",
    thu: "Thurs.",
    fri: "Fri.",
    sat: "Sat.",
    sun: "Sun."
  }
  const weekday_msgs = { mon_msg, tue_msg, wed_msg, thu_msg, fri_msg, sat_msg, sun_msg }

  const handleAddRestaurantClose = () => {
    setIsAddRestaurantModal(false)
  }
  const handleAddRestaurantClickOff = (event) => {
    if (event.target === event.currentTarget) handleAddRestaurantClose();
  }

  const handleAddRestaurantSubmit = async (event) => {
    event.preventDefault();
    const form = form_ref.current.elements;

    // Clear all error messages
    setNameMsg(''); setCostMsg(''); setAboutMsg('');
    setMonMsg(''); setTueMsg(''); setWedMsg('');
    setThuMsg(''); setFriMsg(''); setSatMsg(''); setSunMsg('');
    setStreetMsg(''); setCityMsg(''); setStateMsg('');
    setPostalMsg(''); setCountryMsg('');

    // Ensure all required fields are filled
    if (!form.username.value) await setNameMsg('Please enter restaurant name.')
    if (!form.avg_cost.value) await setCostMsg('Please enter average surplus cost.')
    if (!form.about.value) await setAboutMsg('Please write something about the restaurant.')
    if (!form.mon_time.value) await setMonMsg('Please enter Monday closing time.')
    if (!form.tue_time.value) await setTueMsg('Please enter Tuesday closing time.')
    if (!form.wed_time.value) await setWedMsg('Please enter Wednesday closing time.')
    if (!form.thu_time.value) await setThuMsg('Please enter Thursday closing time.')
    if (!form.fri_time.value) await setFriMsg('Please enter Friday closing time.')
    if (!form.sat_time.value) await setSatMsg('Please enter Saturday closing time.')
    if (!form.sun_time.value) await setSunMsg('Please enter Sunday closing time.')
    if (!form.street_address.value) await setStreetMsg('Please enter street address.')
    if (!form.city.value) await setCityMsg('Please enter city.')
    if (form.state.value === 'none') await setStateMsg('Please select a state.')
    if (!form.postal_code.value) await setPostalMsg('Please enter ZIP/postal code.')
    if (form.country.value === 'none') await setCountryMsg('Please select a country.')
    if (
      !form.username.value ||
      !form.avg_cost.value ||
      !form.about.value ||
      !form.mon_time.value ||
      !form.tue_time.value ||
      !form.wed_time.value ||
      !form.thu_time.value ||
      !form.fri_time.value ||
      !form.sat_time.value ||
      !form.sun_time.value ||
      !form.street_address.value ||
      !form.city.value ||
      form.state.value === 'none' ||
      !form.postal_code.value ||
      form.country.value === 'none'
    ) return
  }

  return (
    <section className="modal_custom" style={{ display: is_add_restaurant_modal ? "block" : "none" }} onClick={handleAddRestaurantClickOff}>
      <section className="modal_content" id="add_restaurant_modal">
        <form className="add_restaurant_form" ref={form_ref} onSubmit={handleAddRestaurantSubmit}>
          <button type="button" className="close_feedback_btn" onClick={handleAddRestaurantClose}>×</button>

          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                    Restaurant Name
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder={name_msg}
                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="avg_cost" className="block text-sm/6 font-medium text-gray-900">
                    Average Surplus Cost
                  </label>
                  <p className="mt-1 text-sm/6 text-gray-600">Use the form XX.XX</p>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">$</div>
                      <input
                        id="avg_cost"
                        name="avg_cost"
                        type="text"
                        placeholder={cost_msg}
                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      placeholder={about_msg || ''}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  <p className="mt-3 text-sm/6 text-gray-600">
                    Write a few sentences about the restaurant, including type of cuisine, expected surplus meals, etc.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Pickup Times</h2>
              <p className="mt-1 text-sm/6 text-gray-600">Please enter your restaurant's preferred pickup times (in the form XX:XXPM)</p>
              {
                weekdays.map((day) => (
                  <div key={day} className="sm:col-span-1 sm:col-start-1">
                    <label htmlFor={`${day}_time`} className="block text-sm/6 font-medium text-gray-900">
                      {weekday_labels[day]}
                    </label>
                    <div className="mt-2">
                      <input
                        id={`${day}_time`}
                        name={`${day}_time`}
                        type="text"
                        placeholder={weekday_msgs[`${day}_msg`]}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Restaurant Address Information</h2>
              <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label htmlFor="street_address" className="block text-sm/6 font-medium text-gray-900">
                    Street address
                  </label>
                  <div className="mt-2">
                    <input
                      id="street_address"
                      name="street_address"
                      type="text"
                      placeholder={street_msg || ''}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder={city_msg || ''}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm/6 font-medium text-gray-900">
                    State / Province
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="state"
                      name="state"
                      placeholder={state_msg || ''}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="none">{state_msg || 'Select a State'}</option>
                      {states.map(s => (
                        <option key={s.abbreviation} value={s.abbreviation}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="postal_code" className="block text-sm/6 font-medium text-gray-900">
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      id="postal_code"
                      name="postal_code"
                      type="text"
                      placeholder={postal_msg || ''}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                    Country
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="country"
                      name="country"
                      placeholder={country_msg || ''}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="none">{country_msg || 'Select a Country'}</option>
                      <option value="US">United States</option>
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="feedback_submit_btn">Submit</button>
        </form>
      </section>
    </section>
  )
}

export default AddRestaurantModal

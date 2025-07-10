import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'


import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

import Select from 'react-select';
import { cuisine_filters_react_select } from '../misc/FilterTypes'
import states from '../misc/States'
import { time_validation, address_validation, money_validation } from '../../utils/utils';
import { log_error } from '../../utils/utils'


const AddRestaurantModal = () => {
  const form_ref = useRef();
  const { base_url, is_add_restaurant_modal, setIsAddRestaurantModal } = useContext(AppContext)

  const [ selected_categories, setSelectedCategories ] = useState([])
  const [ input_img_url, setInputImgURL ] = useState('')

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

  const [ avg_cost_err_msg, setAvgCostErrMsg ] = useState('')
  const [ address_err_msg, setAddressErrMsg ] = useState('')
  const [ server_err_msg, setServerErrorMsg ] = useState('')
  const [ pickup_time_err_msg, setPickupTimeErrMsg ] = useState('')
  const initial_closed_state = Object.fromEntries(weekdays.map(day => [`is_${day}_closed`, false]))
  const [closedStates, setClosedStates] = useState(initial_closed_state)
  const [name_msg, setNameMsg] = useState('')
  const [cost_msg, setCostMsg] = useState('')
  const [descr_msg, setDescrMsg] = useState('')
  const [street_msg, setStreetMsg] = useState('')
  const [city_msg, setCityMsg] = useState('')
  const [state_msg, setStateMsg] = useState('')
  const [postal_msg, setPostalMsg] = useState('')
  const [country_msg, setCountryMsg] = useState('')

  // Take user image file input & convert to usable <img> link
  function previewImage(event) {
        const [file] = event.target.files;
        if (file) {
            const reader = new FileReader();
            reader.onload = function(){
                setInputImgURL(reader.result)
            };
            reader.readAsDataURL(file);
        }
  }

  // Utility Functions
  const clearAllErrMsgs = () => {
    setNameMsg(''); setCostMsg(''); setDescrMsg('');
    setPickupTimeErrMsg(''); setStreetMsg(''); 
    setStateMsg(''); setPostalMsg(''); 
    setCityMsg(''); setCountryMsg(''); setAvgCostErrMsg('');
    setAddressErrMsg(''); setServerErrorMsg('')
  }
  const clearAllUserEntries = () => {
    if(form_ref.current) form_ref.current.reset()
  }

  // Handlers
  const handleAddRestaurantClose = () => {
    setIsAddRestaurantModal(false)

    clearAllErrMsgs()
    clearAllUserEntries()
  }
  const handleAddRestaurantClickOff = (event) => {
    if (event.target === event.currentTarget) handleAddRestaurantClose();
  }
  const handleClosedClick = (is_closed_str) => {
    setClosedStates((prev_closed_states) => ({
      ...prev_closed_states,
      [is_closed_str]: !prev_closed_states[is_closed_str], // toggle the closed state for a specific day
    }))
  }
  const handleAddRestaurantSubmit = async (event) => {
    event.preventDefault();
    const form = form_ref.current.elements;

    // Clear all error messages
    clearAllErrMsgs()

    // Ensure all required fields are filled
    if (!form.name.value) setNameMsg('Please enter restaurant name.')
    if (!form.avg_cost.value) setCostMsg('Please enter average surplus cost.')
    if (!form.descr.value) setDescrMsg('Please write something about the restaurant.')
    if (!form.mon_time.value && !closedStates.is_mon_closed) setPickupTimeErrMsg('Missing monday pickup time')
    if (!form.tue_time.value && !closedStates.is_tue_closed) setPickupTimeErrMsg('Missing tuesday pickup time')
    if (!form.wed_time.value && !closedStates.is_wed_closed) setPickupTimeErrMsg('Missing wednesday pickup time')
    if (!form.thu_time.value && !closedStates.is_thu_closed) setPickupTimeErrMsg('Missing thursday pickup time')
    if (!form.fri_time.value && !closedStates.is_fri_closed) setPickupTimeErrMsg('Missing friday pickup time')
    if (!form.sat_time.value && !closedStates.is_sat_closed) setPickupTimeErrMsg('Missing saturday pickup time') 
    if (!form.sun_time.value && !closedStates.is_sun_closed) setPickupTimeErrMsg('Missing sunday pickup time') 
    if (!form.street_address.value) setStreetMsg('Please enter street address.')
    if (!form.city.value) setCityMsg('Please enter city.')
    if (form.state.value === 'none') setStateMsg('Please select a state.')
    if (!form.postal_code.value) setPostalMsg('Please enter ZIP/postal code.')
    if (form.country.value === 'none') setCountryMsg('Please select a country.')
    if (
      !form.name.value ||
      !form.avg_cost.value ||
      !form.descr.value ||
      (!form.mon_time.value && !closedStates.is_mon_closed ) ||
      (!form.tue_time.value && !closedStates.is_tue_closed ) ||
      (!form.wed_time.value && !closedStates.is_wed_closed ) ||
      (!form.thu_time.value && !closedStates.is_thu_closed ) ||
      (!form.fri_time.value && !closedStates.is_fri_closed ) ||
      (!form.sat_time.value && !closedStates.is_sat_closed ) ||
      (!form.sun_time.value && !closedStates.is_sun_closed ) ||
      !form.street_address.value ||
      !form.city.value ||
      form.state.value === 'none' ||
      !form.postal_code.value ||
      form.country.value === 'none'
    ) return

    // Cost validation
    const is_valid_cost = money_validation(form.avg_cost.value)
    if(!is_valid_cost) {
        setAvgCostErrMsg('Entered an invalid avg. cost')
        return
    }

    // Address validation
    const is_valid_address = address_validation(form.street_address.value, form.city.value, form.state.value, form.postal_code.value)
    if(!is_valid_address) {
        setAddressErrMsg('Entered invalid address')
        return
    }

    try {
        
        const body = {
            name: form.name.value,
            descr: form.descr.value,
            address: {
                street_address: form.street_address.value,
                city: form.city.value,
                postal_code: form.postal_code.value,
                state: form.state.value,
                country: form.country.value,
            },
            categories: selected_categories.map((category) => category.value),
            img_url: input_img_url,
            img_alt: `${form.name.value} Banner`,
            avg_cost: form.avg_cost.value,
            pickup_time: [(closedStates[`is_sun_closed`]) ? 'N/A' : form.sun_time.value, 
                          (closedStates[`is_mon_closed`]) ? 'N/A' : form.mon_time.value, 
                          (closedStates[`is_tue_closed`]) ? 'N/A' : form.tue_time.value, 
                          (closedStates[`is_wed_closed`]) ? 'N/A' : form.wed_time.value, 
                          (closedStates[`is_thu_closed`]) ? 'N/A' : form.thu_time.value, 
                          (closedStates[`is_fri_closed`]) ? 'N/A' : form.fri_time.value, 
                          (closedStates[`is_sat_closed`]) ? 'N/A' : form.sat_time.value],
            time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
        const response  = await fetch(base_url + `/restaurant`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })
        if(response.status === 400) {
            const { message } = await response.json()
            setServerErrorMsg(message)
        } else {
            setServerErrorMsg('')
        }
        const { message } = await response.json()
        const err = new Error(`Failed to add restaurant. Status: ${response.status}. ErrMsg: ${message}`)
        err.status = response.status
        if(!response.ok) throw err

        setIsAddRestaurantModal(false)

        setInputImgURL('')
    } catch (err) {
        await log_error(err)
    }
  }

  return (
    <section className="modal_custom" style={{ display: is_add_restaurant_modal ? "block" : "none" }} onClick={handleAddRestaurantClickOff}>
      <section className="modal_content" id="add_restaurant_modal">
        <form className="add_restaurant_form" ref={form_ref} onSubmit={handleAddRestaurantSubmit}>
          <button type="button" className="close_feedback_btn" onClick={handleAddRestaurantClose}>×</button>

          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Restaurant Profile</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                    Restaurant Name
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id="name"
                        name="name"
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
                    {
                        avg_cost_err_msg ? <p className="mt-1 text-sm/6 text-red-600">{avg_cost_err_msg}</p> : null
                    }
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
                <label htmlFor="categories" className="block text-sm/6 font-medium text-gray-900">
                    Categories
                </label>
                    <Select options={cuisine_filters_react_select} isMulti closeMenuOnSelect={false} hideSelectedOptions={false} placeholder="Choose cuisines..." value={selected_categories} onChange={setSelectedCategories}/>
                </div>

                <div className="col-span-full">
                  <label htmlFor="descr" className="block text-sm/6 font-medium text-gray-900">
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="descr"
                      name="descr"
                      rows={3}
                      placeholder={descr_msg || ''}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  <p className="mt-3 text-sm/6 text-gray-600">
                    Write a few sentences about the restaurant, including type of cuisine, expected surplus meals, etc.
                  </p>
                </div>

                <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                    Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                    <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                        >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={previewImage} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    {
                        input_img_url && <img id="image_preview" src={input_img_url} alt="Image Preview"></img>
                    }
                    <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Pickup Times</h2>
              <p className="mt-1 text-sm/6 text-gray-600">Please enter your restaurant's preferred pickup times</p>
              {
                pickup_time_err_msg ? <p className="mt-1 text-sm/6 text-red-600">{pickup_time_err_msg}</p> : null
              }
              {
                weekdays.map((day) => (
                  <div key={day} className="sm:col-span-1 sm:col-start-1">
                    <label htmlFor={`${day}_time`} className="block text-sm/6 font-medium text-gray-900">
                      {weekday_labels[day]}
                    </label>
                    <div className="mt-2">
                      <input aria-label="Time" name={`${day}_time`} type="time" />
                      <button type="button" name={`${day}_closed_btn`} style={{backgroundColor: closedStates[`is_${day}_closed`] ? `#EE4B2B` : `#AFE1AF`}} onClick={() => {handleClosedClick(`is_${day}_closed`)}}>{closedStates[`is_${day}_closed`] ? `Closed` : `Open`}</button>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Restaurant Address Information</h2>
              <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>
              {
                address_err_msg ? <p className="mt-1 text-sm/6 text-red-600">{address_err_msg}</p> : null
              }

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

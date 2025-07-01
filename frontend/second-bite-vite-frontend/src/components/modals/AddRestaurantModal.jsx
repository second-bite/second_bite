import React, { useContext, useRef } from 'react'
import { AppContext } from '../../App'

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

import Select from 'react-select';
import { cuisine_filters_react_select } from '../misc/FilterTypes'

const AddRestaurantModal = () => {
    const form_ref = useRef();
    const {is_add_restaurant_modal, setIsAddRestaurantModal} = useContext(AppContext)

    const handleAddRestaurantClose = () => {
        // TODO: Clear out all input
        setIsAddRestaurantModal(false)
    }
    const handleAddRestaurantClickOff = (event) => {
        if(event.target === event.currentTarget) handleAddRestaurantClose();
    }
    const handleAddRestaurantSubmit = () => {

    }

    return (
        <section className="modal_custom" style={{display: is_add_restaurant_modal ? "block" : "none"}} onClick={handleAddRestaurantClickOff}>
            <section className="modal_content" id="add_restaurant_modal">
                <form className="add_restaurant_form" onSubmit={handleAddRestaurantSubmit}>
                    <button type="button" className="close_feedback_btn" onClick={handleAddRestaurantClose}>×</button>

                    <form>
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
                                    placeholder="RestaurantName"
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                                </div>
                            </div>
                            </div>

                            <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Average Surplus Cost
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">$</div>
                                <input
                                    id="avg_cost"
                                    name="avg_cost"
                                    type="text"
                                    placeholder="0.00"
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
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                defaultValue={''}
                                />
                            </div>
                            <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about the restaurant, including type of cuisine, expected surplus meals, etc.</p>
                            </div>

                            <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                                Categories
                            </label>
                            <Select options={cuisine_filters_react_select} isMulti closeMenuOnSelect={false} hideSelectedOptions={false} placeholder="Choose cuisines..." />
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
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-gray-900">Closing Times</h2>
                        <p className="mt-1 text-sm/6 text-gray-600">Please enter closing times for each weekday. If not open on a given weekday, enter "N/A".</p>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
                            <div className="sm:col-span-1 sm:col-start-1">
                            <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                                Mon.
                            </label>
                            <div className="mt-2">
                                <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="10:00PM"
                                autoComplete="address-level2"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-1">
                            <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                                Tues.
                            </label>
                            <div className="mt-2">
                                <input
                                id="region"
                                name="region"
                                type="text"
                                placeholder="10:00PM"
                                autoComplete="address-level1"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-1">
                            <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                                Wed.
                            </label>
                            <div className="mt-2">
                                <input
                                id="postal-code"
                                name="postal-code"
                                type="text"
                                placeholder="10:00PM"
                                autoComplete="postal-code"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>
                            <div className="sm:col-span-1">
                            <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                                Thurs.
                            </label>
                            <div className="mt-2">
                                <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="10:00PM"
                                autoComplete="address-level2"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-1">
                            <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                                Fri.
                            </label>
                            <div className="mt-2">
                                <input
                                id="region"
                                name="region"
                                type="text"
                                placeholder="9:00PM"
                                autoComplete="address-level1"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-1">
                            <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                                Sat.
                            </label>
                            <div className="mt-2">
                                <input
                                id="postal-code"
                                name="postal-code"
                                type="text"
                                placeholder="8:00PM"
                                autoComplete="postal-code"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-1">
                            <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                                Sun.
                            </label>
                            <div className="mt-2">
                                <input
                                id="postal-code"
                                name="postal-code"
                                type="text"
                                placeholder="6:00PM"
                                autoComplete="postal-code"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>


                        <div className="border-b border-gray-900/10 pb-12"></div>
                        <h2 className="text-base/7 font-semibold text-gray-900">Restaurant Address Information</h2>
                        <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                autoComplete="given-name"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                id="last-name"
                                name="last-name"
                                type="text"
                                autoComplete="family-name"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
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
                                autoComplete="country-name"
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                >
                                <option>United States</option>
                                <option>Canada</option>
                                <option>Mexico</option>
                                </select>
                                <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </div>
                            </div>

                            <div className="col-span-full">
                            <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                                Street address
                            </label>
                            <div className="mt-2">
                                <input
                                id="street-address"
                                name="street-address"
                                type="text"
                                autoComplete="street-address"
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
                                autoComplete="address-level2"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-2">
                            <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                                State / Province
                            </label>
                            <div className="mt-2">
                                <input
                                id="region"
                                name="region"
                                type="text"
                                autoComplete="address-level1"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>

                            <div className="sm:col-span-2">
                            <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                                ZIP / Postal code
                            </label>
                            <div className="mt-2">
                                <input
                                id="postal-code"
                                name="postal-code"
                                type="text"
                                autoComplete="postal-code"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            </div>
                        </div>
                        </div>

                    </div>

                    {/* <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900">
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Save
                        </button>
                    </div> */}
                    </form>


                    <button type="submit" className="feedback_submit_btn">Submit</button>
                </form>
            </section>
        </section>
    )
}

export default AddRestaurantModal
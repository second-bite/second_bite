import React, {useState, useContext} from 'react'
import { Menu } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'

import { AppContext } from '../App'

const PrimaryHeader = () => {
    const navigate = useNavigate()

    const {is_feedback_modal, setIsFeedbackModal} = useContext(AppContext)

    const handleFeedbackClick = () => {setIsFeedbackModal(true)}

    const handleAccountInfoClick = () => {
        navigate('/account')
    }

    return (
        <header className="primary_header">
            <h1>SecondBite</h1>
            <section className="account">
            <div className="relative inline-block text-left">
            <Menu>
                <Menu.Button className="inline-flex justify-center w-full rounded-md px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none">
                <Bars3Icon className="h-6 w-6 text-gray-700" />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                <div className="py-1">
                    <Menu.Item>
                    {({ active }) => (
                        <a
                        href="#"
                        onClick={handleAccountInfoClick}
                        className={`block px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                        >
                        Account Details
                        </a>
                    )}
                    </Menu.Item>
                    <Menu.Item>
                    {({ active }) => (
                        <a
                        href="#"
                        className={`block px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                        >
                        Favorited
                        </a>
                    )}
                    </Menu.Item>
                    <Menu.Item>
                    {({ active }) => (
                        <a
                        href="#"
                        className={`block px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                        >
                        Shopped
                        </a>
                    )}
                    </Menu.Item>
                    <Menu.Item>
                    {({ active }) => (
                        <a
                        href="#"
                        className={`block px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                        >
                        Sign out
                        </a>
                    )}
                    </Menu.Item>
                    <Menu.Item>
                    {({ active }) => (
                        <a
                        href="#"
                        onClick={e => { e.preventDefault(); handleFeedbackClick(); }}
                        className={`block px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                        >
                        Feedback
                        </a>
                    )}
                    </Menu.Item>
                </div>
                </Menu.Items>
            </Menu>
            </div>
            </section>
        </header>
    )
}


export default PrimaryHeader
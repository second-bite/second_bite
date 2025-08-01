import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'

import { Menu } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';

import { AppContext } from '../context/AppContext'
import { AuthContext } from '../context/AuthContext'
import { log_error } from '../utils/utils'

const PrimaryHeader = () => {
    const navigate = useNavigate()

    const {base_url, is_feedback_modal, setIsFeedbackModal, setIsFriendModal} = useContext(AppContext)
    const {setIsLoading, auth_status, AUTH_STATUS, setAuthStatus} = useContext(AuthContext)

    const handleFeedbackClick = () => {setIsFeedbackModal(true)}

    const handleAccountInfoClick = () => {
        if(auth_status === AUTH_STATUS.OWNER_AUTH) {
            navigate('/owner')
        }
        else if(auth_status === AUTH_STATUS.CONSUMER_AUTH) {
            navigate('/account')
        }
    }
    const handleChatClick = () => {
        navigate('/chat')
    }
    const handleAnalyticsClick = () => {
        navigate('/analytics')
    }
    const handleSignOut = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(base_url + '/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
            const res_json = await response.json()
            if(!response.ok) {
                const err = new Error(`Status Code: ${response.status}. ErrMsg: ${res_json.message}`)
                err.status = response.status
                throw err
            }
            setAuthStatus(AUTH_STATUS.UNAUTH)
            navigate('/auth')
        } catch (err) {
            await log_error(err)
        } finally {
            setIsLoading(false)
        }
    }
    const handleFriendClick = () => {
        setIsFriendModal(true)
    }

    return (
        <header className="primary_header">
            <h1>SecondBite</h1>
            <section className="account">
            <div className="relative inline-block text-left">
            <section className="header_btns">
                {
                    (auth_status === AUTH_STATUS.CONSUMER_AUTH) ? <button type="button" className="friend_btn" onClick={handleFriendClick}><img className="friend_img" src="/friends.png" alt="Friend Icon" /></button> : null
                }
                <Menu>
                    <Menu.Button className="inline-flex justify-center w-full rounded-md px-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none">
                    <Bars3Icon className="h-6 w-6 text-gray-700" />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 mt-2 w-15 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
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
                            {/* Icon Credit: https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-user */}                
                            <section className="tooltip_custom">
                                <i className="fa fa-user text-lg"></i>
                                <span className="tooltip_custom_text">Account Details</span>
                            </section>
                            </a>
                        )}
                        </Menu.Item>
                        {
                            (auth_status === AUTH_STATUS.CONSUMER_AUTH) ? (
                                <>
                                    <Menu.Item>
                                    {({ active }) => (
                                        <a
                                        href="#"
                                        onClick={handleChatClick}
                                        className={`block px-4 py-2 text-sm ${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        }`}
                                        >
                                        {/* Icon Credit: https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-shopping-cart */}
                                        <section className="tooltip_custom">
                                            <FontAwesomeIcon icon={faCommentDots} className="text-base" />
                                            <span className="tooltip_custom_text">Chat</span>
                                        </section>
                                        </a>
                                    )}
                                    </Menu.Item>
                                </>
                            ) : (auth_status === AUTH_STATUS.OWNER_AUTH) ? (
                                <Menu.Item>
                                {({ active }) => (
                                    <a
                                    href="#"
                                    onClick={handleAnalyticsClick}
                                    className={`block px-4 py-2 text-sm ${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    }`}
                                    >
                                    {/* Icon Credit: https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-bar-chart */}
                                    <section className="tooltip_custom">
                                        <i style={{ fontSize: '20px' }} className='fa fa-bar-chart-o' />
                                        <span className="tooltip_custom_text">Analytics</span>
                                    </section>
                                    </a>
                                )}
                                </Menu.Item>
                                
                            ) : null
                        }
                        <Menu.Item>
                        {({ active }) => (
                            <a
                            href="#"
                            onClick={handleSignOut}
                            className={`block px-4 py-2 text-sm ${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                            >
                            {/* Icon Credit: https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-sign-out */}
                            <section className="tooltip_custom">
                                <i className="fa fa-sign-out text-lg"></i>
                                <span className="tooltip_custom_text">Sign out</span>
                            </section>
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
                            {/* Icon Credit: https://www.w3schools.com/icons/tryit.asp?filename=tryicons_google-feedback*/}
                            <section className="tooltip_custom">
                                <i className="material-icons">feedback</i>
                                <span className="tooltip_custom_text">Feedback</span>
                            </section>            
                            </a>
                        )}
                        </Menu.Item>
                    </div>
                    </Menu.Items>
                </Menu>                
            </section>
            </div>
            </section>
        </header>
    )
}


export default PrimaryHeader
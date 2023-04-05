/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'jquery',
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'underscore',
    'escaper',
    'Magento_Ui/js/modal/modal',
    'jquery/jquery-storageapi'

], function ($, Component, customerData, _, escaper, modal) {
    'use strict';

    return Component.extend({
        defaults: {
            cookieMessages: [],
            messages: [],
            allowedTags: ['div', 'span', 'b', 'strong', 'i', 'em', 'u', 'a']
        },

        /**
         * Extends Component object by storage observable messages.
         */
        initialize: function () {
            this._super();
            this.cookieMessages = _.unique($.cookieStorage.get('mage-messages'), 'text');
            this.messages = customerData.get('messages').extend({
                disposableCustomerData: 'messages'
            });
            this.messages.subscribe(function(newMsg) {

                let msgObj = newMsg.messages; 
                if(msgObj.length > 0 ) {
                   let newMessage =  msgObj[0].text;
                    var options = {
                        type: 'popup',
                        responsive: true,
                        innerScroll: true,
                        title: '',
                        buttons: [{
                            text: $.mage.__('Ok'),
                            class: '',
                            click: function () {
                                this.closeModal();
                            }
                        }]
                    };
                    var popup = modal(options, $('#popup-modal'));
                    if(newMessage) {
                        $('#popup-modal').modal('openModal');    
                    }
                }
            });
            
            // Force to clean obsolete messages
            if (!_.isEmpty(this.messages().messages)) {
                customerData.set('messages', {});
            }

            $.mage.cookies.set('mage-messages', '', {
                samesite: 'strict',
                domain: ''
            });
        },

        /**
         * Prepare the given message to be rendered as HTML
         *
         * @param {String} message
         * @return {String}
         */
        prepareMessageForHtml: function (message) {
             console.log("ehhhhhh");
            return escaper.escapeHtml(message, this.allowedTags);
        }
    });
});

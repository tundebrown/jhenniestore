import useSettingStore from '@/hooks/use-setting-store'
import Link from 'next/link'
import React from 'react'
import { Shield, HelpCircle, RotateCcw, FileText } from 'lucide-react'

export default function CheckoutFooter() {
  const {
    setting: { site },
  } = useSettingStore()
  
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold mb-2">Secure Payment</h4>
          <p className="text-sm text-gray-600">Your payment information is protected</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <RotateCcw className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold mb-2">Easy Returns</h4>
          <p className="text-sm text-gray-600">30-day return policy</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600">
            <Link href="/page/help" className="text-blue-600 hover:underline">Help Center</Link> or{' '}
            <Link href="/page/contact-us" className="text-blue-600 hover:underline">Contact Us</Link>
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <h4 className="font-semibold mb-2">Policies</h4>
          <p className="text-sm text-gray-600">
            By placing your order, you agree to our{' '}
            <Link href="/page/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> and{' '}
            <Link href="/page/conditions-of-use" className="text-blue-600 hover:underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
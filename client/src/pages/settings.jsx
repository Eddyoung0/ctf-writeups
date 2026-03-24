import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [darkHeader, setDarkHeader] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      'userSettings',
      JSON.stringify({ emailUpdates, orderAlerts, darkHeader })
    );
    toast.success('Settings saved');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-neutral-900">Settings</h1>
          <p className="mt-2 text-sm text-neutral-600">Customize your notifications and app preferences.</p>

          <div className="mt-8 space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50">
              <div>
                <p className="font-medium text-neutral-900">Email Updates</p>
                <p className="text-sm text-neutral-500">Receive promotions and product announcements.</p>
              </div>
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                className="h-5 w-5 accent-[#007E5D]"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50">
              <div>
                <p className="font-medium text-neutral-900">Order Alerts</p>
                <p className="text-sm text-neutral-500">Get status updates for your cart and orders.</p>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                className="h-5 w-5 accent-[#007E5D]"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50">
              <div>
                <p className="font-medium text-neutral-900">Compact Header</p>
                <p className="text-sm text-neutral-500">Use a tighter top spacing for content sections.</p>
              </div>
              <input
                type="checkbox"
                checked={darkHeader}
                onChange={(e) => setDarkHeader(e.target.checked)}
                className="h-5 w-5 accent-[#007E5D]"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            className="mt-8 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

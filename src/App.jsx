import './assets/App.css';
import ScanCode from './components/ScanCode';

function App() {


  return (
    <>
    <h1 className='text-center text-5xl font-comfortaa mt-4'>QuickReveal</h1>
    <div className='border-2 border-blue-900 m-15 h-screen md:grid md:grid-cols-2 sm:grid sm:grid-rows-2'>
      <div className='bg-gradient-to-r from-purple-500 via-purple-200 to-purple-300 p-8 rounded-lg shadow-lg'>
        <h1 className='text-center text-xl font-comfortaa'>Scan QR</h1>
        <ScanCode />


      </div>
      <div className='bg-gradient-to-r from-blue-00 via-purple-200 to-purple-300 p-8 rounded-lg shadow-lg'>
      <h1 className='text-center text-xl font-comfortaa'>Generate New QR</h1>

      </div>

    </div>

    </>
   
  )
}

export default App

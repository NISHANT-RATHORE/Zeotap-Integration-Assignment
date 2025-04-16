import SourceSelection from './Component/SourceSelection';
import Dashboard from './Component/Dashboard';
import ConnectionForm from "./Component/ConnectionForm.jsx";
import {Toaster} from 'react-hot-toast';
import {Route, Routes} from "react-router-dom";

function App() {

    return (
        <div>
            <Toaster/>
            <Routes>
                <Route path="/" element={<SourceSelection />} />
                <Route path="/connection-form" element={<ConnectionForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
}

export default App;
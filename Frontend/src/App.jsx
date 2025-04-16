import SourceSelection from './Component/SourceSelection';
import ClickHouseDashboard from './Component/ClickHouseDashboard.jsx';
import ConnectionForm from "./Component/ConnectionForm.jsx";
import FlatFileDashboard from "./Component/FlatFileDashboard.jsx";
import {Toaster} from 'react-hot-toast';
import {Route, Routes} from "react-router-dom";

function App() {

    return (
        <div>
            <Toaster/>
            <Routes>
                <Route path="/" element={<SourceSelection />} />
                <Route path="/connection-form" element={<ConnectionForm />} />
                <Route path="/dashboard" element={<ClickHouseDashboard />} />
                <Route path="/flat-file" element={<FlatFileDashboard/>} />
            </Routes>
        </div>
    );
}

export default App;
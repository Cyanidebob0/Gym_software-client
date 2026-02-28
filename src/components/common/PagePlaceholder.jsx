const PagePlaceholder = ({ title }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 mt-2">This page is under construction.</p>
        </div>
    );
};

export default PagePlaceholder;

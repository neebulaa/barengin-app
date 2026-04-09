import MainLayout from '@/Layouts/MainLayout';

export default function Home(){
    return <h1 className="text-xl">Home</h1>;
}

Home.layout = page => <MainLayout children={page} />;
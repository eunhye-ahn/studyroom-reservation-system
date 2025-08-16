import React, {useState} from "react";
import { Globe, Search, Menu, X } from "lucide-react";

const Header: React.FC=()=>{

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = {
    '회사소개': {
      items: [
        { name: '경력 및 인증', href: '#' },
        { name: '오시는 길', href: '#' },
        { name: '완료된 프로젝트', href: '#' },
        { name: '회사 번호', href: '#' }
      ]
    },
        '장비정보': {
      items: [
        { name: '카고크레인', href: '#' },
        { name: '지게차', href: '#' },
        { name: '컨테이너 운반', href: '#' },
        { name: '군용장비', href: '#' }
      ]
    },
    '예약': {
      items: [
        { name: '콜백', href: '#' },
        { name: '즉시예약', href: '#' },
        { name: '홍보자료', href: '#' }
      ]
    },


    };

    return (
      <header className='fixed top-0 w-full shadow-md z-50 bg-white'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
          
          <div className="flex itmes-center">
          <div className='text-blue-600 text-xl font-bold'>힘쎈카고크레인</div>
        </div>
        
<nav
  className='hidden lg:flex space-x-8 text-sm font-semibold text-gray-800'
  onMouseEnter={() => setActiveDropdown('all')}
  onMouseLeave={() => setActiveDropdown(null)}
>
  {Object.entries(menuItems).map(([key, menu]) => (
    <div key={key} className="relative">
      <a
        href="#"
        className="hover:text-blue-600 py-6 transition-colors duration-200"
      >
        {key}
      </a>
    </div>
  ))}
</nav>

{activeDropdown && (
  <div
    className="absolute top-16 left-0 w-full bg-white shadow-xl border-t border-gray-200 z-40"
    onMouseEnter={() => setActiveDropdown('all')}
    onMouseLeave={() => setActiveDropdown(null)}
  >
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-4 gap-8">
      {Object.entries(menuItems).map(([key, menu]) => (
        <div key={key}>
          <h3 className="font-bold text-gray-900 mb-4">{key}</h3>
          <div className="space-y-3">
            {menu.items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-150 text-sm py-1"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          <div className="flex items-center space-x-4">
              <img src="/icons/call.svg" alt="전화"
              className="w-5" />
              <p>010-3603-5119</p>
          </div>
          <div>
            <button className="border-2 border-black px-4 py-2 rounded hover:border-blue-500">빠른 견적</button>
          </div>

        </div>

        {isMobileMenuOpen && (
          <div className="lg hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
              {Object.entries(menuItems).map(([key,menu])=>(
                <div key={key}
                className="py-2"
                >
                  <div className="font-semibold text-gray-800 py-2 border-b border-gray-100">{key}</div>
                 <div className="pl-4 space-y-1 mt-2">
                  {menu.items.map((item,index)=>(
                    <a  key={index} href={item.href}
                                          className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}

                    >
                      {item.name}
                    </a>
                  ))}

                 </div>
                  </div>
              ))}
            </div>
          </div>
        )}
      </header>
    )
  }

  export default Header;
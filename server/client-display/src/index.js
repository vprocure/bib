import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import myData from './bibgxrestau.json';

class BibgxRestau extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value_name: -1,
          value_adress:-1
        };
      }

    HandleClickName(){
        let sort = this.state.value_name;
        if(sort===0 || sort===-1){
            sort=1
        }
        else{
            sort=0
        }
        this.setState({value_name:sort});
    }

    HandleClickAdress(){
        let sort = this.state.value_adress;
        if(sort===0 || sort===-1){
            sort=1
        }
        else{
            sort=0
        }
        this.setState({value_adress:sort});
    }
    render() {
      const disp = myData;
      return (
        <div>
            <table >
                <tr>
                    <th>Name<br/>
                    <button className="sort" onClick={() => this.HandleClickName()}>
                    {this.props.value_name}Sort
                    </button>
                    </th>
                    
                    <th>Adress<br/>
                    <button className="sort" onClick={() => this.HandleClickAdress()}>
                    {this.props.value_adress}Sort
                    </button>
                    </th>
                    <th>Phone</th>
                </tr>
              
            {
                Object.keys(disp).map((key, index) => ( 
                <tr>
                    <td>{disp[index]['name']}</td>
                    <td>{disp[index]['adress']}</td> 
                    <td>{disp[index]['phone']}</td>
                </tr> 
                ))
            }
            </table>
        </div>
      );
    }
  }
  

  
  ReactDOM.render(
    <BibgxRestau />,
    document.getElementById('root')
  );
  
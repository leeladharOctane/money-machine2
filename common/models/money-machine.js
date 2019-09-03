"use strict";
var loopback = require('loopback');
var xlsxj = require('xlsx-to-json');

module.exports = function (MoneyMachine) {
    
    MoneyMachine.postData = function (data,cb) {
        var formattedData = JSON.parse(data);
        MoneyMachine.create(formattedData,function(err,response){
            if(err){
                console.log(err);
                cb(err);
            }
            else
                cb(null,response);
        });
    }
    MoneyMachine.remoteMethod(
        'postData',
        {
            http : {
                path : '/newMoneyMachine',
                verb : 'post'
            },
            accepts : {
                arg : 'data',
                type : 'string'
            },
            returns : {
                arg : 'response',
                root: true
            }
        }
    );

    MoneyMachine.remoteMethod(
        'machineOwnerName',{
            http:{
                path : '/MachineOwnerName',
                verb : 'get'
            },
            accepts : {
                arg : 'OwnerName',
                type : 'string'
            },
            returns : {
                arg : 'response',
                root: true
            }
        }
    );
    MoneyMachine.machineOwnerName = function(applicantName, cb){
        var query = {
            where:{
                Applicant : applicantName
            }
        }
        MoneyMachine.find(query,function(err,response){
            if(err){
                console.log(err);
                cb(err);
            }
            else{
                if(response.length == 0)
                    cb(null,"No such applicant name exist");
                else
                    cb(null,response);
            }
        });
    };
    MoneyMachine.remoteMethod(
        'getByexpiryDate' ,{
            http : {
                path : '/expiryDate',
                verb : 'get'
            },
            returns : {
                arg : 'response',
                root:true
            }
        }
    );
    MoneyMachine.getByexpiryDate = function (cb){
        console.log("this is for testing");
        var currentDate = Date.now();
        console.log(currentDate);
        var query = {
            where :{
                ExpirationDate : {lt : currentDate}
            }
        }
        MoneyMachine.find(query,function(err,response){
            console.log(JSON.stringify(response));
            if(err){
                console.log(err);
                cb(err);
            }
            else
                cb(null,response);
        });
    }

    MoneyMachine.remoteMethod(
        'getByStreetName',{
            http:{
                path : '/streetName',
                verb : 'get'
            },
            accepts : {
                arg : 'Applicant',
                type : 'string'
            },
            returns : {
                arg : 'response',
                root: true
            }
        }
    );
    MoneyMachine.getByStreetName = function(streetName, cb){
        var query = {
            where:{
                Address : streetName
            }
        }
        MoneyMachine.find(query,function(err,response){
            if(err){
                console.log(err);
                cb(err);
            }
            else
                cb(null,response);
        });
    };


    MoneyMachine.remoteMethod(
        'getNearestMoneyMachine',{
            http:{
                path : '/nearestMoneyMachine',
                verb : 'get'
            },
            accepts : [{
                arg : 'Horizontal',
                type : 'number'
            },{
                arg : 'Vertical',
                type : 'number'
            }],
            returns : {
                arg : 'response',
                root: true
            }
        }
    );
    MoneyMachine.getNearestMoneyMachine = function(latitude,longitude,cb){
        var here = new loopback.GeoPoint( {lat: 10, lng: 10} );
        var there = new loopback.GeoPoint( {lat: 5, lng: 5} );
        var d= here.distanceTo( there, {type: 'miles'} ) ;
        cb(null,d);
    };

    MoneyMachine.changePermitStatus = function(){
        var data = { Status : "EXPIRED"};
        var currentDate = Date.now();
        MoneyMachine.updateAll({ExpirationDate : {lt : currentDate}},data,function(err,response){
            if(err){
                console.log(err);
            }
            else
                console.log(response);
        });
    }
};
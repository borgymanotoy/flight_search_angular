(function(){
    var bookingModule = angular.module('booking', []);

    bookingModule.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    ]);

    bookingModule.directive('headerPanel', function(){
        return {
            restrict: 'E',
            templateUrl: 'pages/booking-header-panel.html',
            controller: function(){
                //Scopes.store('headerController', this);

                this.searchValues = searchValues;

                this.getSearchSummary = function(){
                    var summary = "";
                    if(this.searchValues.origin && this.searchValues.destination)
                        summary += this.searchValues.origin + " - " + this.searchValues.destination;

                    if(this.searchValues.hasPR || this.searchValues.hasPQ || this.searchValues.has5J){
                        summary += " (";
                        if(this.searchValues.hasPR) summary += "Philippine Airlines";
                        if(this.searchValues.hasPR && this.searchValues.hasPQ) summary += "/";
                        if(this.searchValues.hasPQ) summary += "Air Asia";
                        if((this.searchValues.hasPR || this.searchValues.hasPQ) && this.searchValues.has5J) summary += "/";
                        if(this.searchValues.has5J) summary += "Cebu Pacific";
                        summary += ")";
                    }

                    return summary;
                };
            },
            controllerAs: 'header'
        }
    });

    bookingModule.directive('footerPanel', function(){
        return {
            restrict: 'E',
            templateUrl: 'pages/footer-panel.html'
        }
    });

    bookingModule.directive('formPanel', ['$http', function($http){
        return {
            restrict: 'E',
            templateUrl: 'pages/search-form-panel.html',
            controller: function(){
                //Scopes.store('formSearchController', this);

                this.searchValues = searchValues;

                this.searchFlights = function(){
                    var booking = this;
                    booking.flights = [];
                    $http.get('js/flights.json').success(function(data){
                        booking.flights = data;
                    });
                };

                this.hasOriginDestination = function(){
                    if(this.searchValues.origin && this.searchValues.destination)
                        return true;
                    else
                        return false;
                };

                this.clearSearchValue = function(){
                    console.log('Biko-Latik');
                    this.searchValues = null;
                    //Scopes.get('headerController').getSearchSummary();
                };
            },
            controllerAs: 'form'
        }
    }]);

    bookingModule.directive('clearFields', function () {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {

                function functionToBeCalled () {
                    console.log("It worked!");
                }

                element.on('click', functionToBeCalled);
            }
        };
    });

    bookingModule.directive('dropdownPanel', function(){
        return {
            restrict: 'E',
            templateUrl: 'pages/dropdown-panel.html',
            controller: function($http){
                var booking = this;
                booking.flights = [];

                // $http.get('js/flights.json').success(function(data){
                //     booking.flights = data;
                // });

                this.displayFlightSegments = function(flight){
                    if(1 == flight.segmentsCount){
                        return "(" + flight.segmentsCount + ") " + flight.flightSegments[0].flightCode;
                    }
                    else {
                        var fCode = '';
                        var isFirst = true;
                        $.each(flight.flightSegments, function(idx, fs) {
                            if(!isFirst) fCode += ' -> ';
                            fCode += fs.flightCode;
                            isFirst = false
                        });

                        return "(" + flight.segmentsCount + ") " + fCode;
                    }
                };
            },
            controllerAs: 'dropdown'
        }
    });

    bookingModule.directive('filterFlightsPanel', function(){
        return {
            restrict: 'E',
            templateUrl: 'pages/filter-flights-panel.html',
            controller: function(){

            },
            controllerAs: 'filter'
        }
    });

    bookingModule.directive('resultsTablePanel', function(){
        return {
            restrict: 'E',
            templateUrl: 'pages/data-table-panel.html',
            controller: function($http){
                var booking = this;
                booking.flights = [];

                var origin = "DVO";
                var destination = "CEB";
                var departureDate = "08-16-2016";
                var hasPR = true;
                var hasPQ = true;

                var url = 'http://52.76.217.169:8080/UniversalTicketing/searchOneWayFlights?origin=' + origin + '&destination=' + destination + '&departureDate=' + departureDate;
                if(hasPR) url += "&hasPR=true";
                if(hasPQ) url += "&hasPQ=true";
                url += '&callback=?';

                console.log(url);
                $http.get(url).success(function(response){
                    booking.flights = response.data;
                    alert('OK');
                });

                // $http.get('js/flights.json').success(function(data){
                //     booking.flights = data;
                // });
            },
            controllerAs: 'dTable'
        }
    });


    /* START: DATA */
    var searchValues = {
        origin: 'DVO',
        destination: 'CEB',
        departureDate: '08-03-2016',
        hasPR: true,
        hasPQ: false,
        has5J: false
    }


    /* END: DATA */

    bookingModule.controller('getFlightResults', ['$scope', '$http', function($scope, $http) {
      $http.get('js/flights.json').success(function(data) {
        $scope.flights = data;
      });
    }]);

})();
# LimeLM distributed proxy
LimeLM is a common online activation software licensing service. This proxy attempts to intercept requests to the LimeLM authentication API and persist responses. The authentication response can then be mocked on all subsequent requests to the service in different instances of the program.

I am using a distributed file system with a master instance that will interact with the LimeLM authentication API. Child instances are then deployed under the distributed file system which retrieve authentication responses from the persisted file.
This grants the capability of running a LimeLM authentication based software on an indefinite amount of computers, opposed to a fixed amount.
